import React, { useRef, useState } from 'react';
import { Upload, Slider, message } from 'antd';
import type { UploadFile, RcFile } from 'antd/lib/upload/interface';
import ImgCrop from 'antd-img-crop';

const isUnderLimit = (size: number, limitMB: 5) => {
  if (size / 1024 / 1024 < limitMB) return true;
  return false;
};

const isAcceptImgType = (type: string, acceptableTypes: string[]) => {
  if (acceptableTypes.includes(type)) return true;
  return false;
};

export default function Test() {
  const acceptableTypes = ['image/jpeg', 'image/png'];
  const limitMB = 5;

  const initialImg: UploadFile = {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url:
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    type: 'image/png',
    size: 1,
  };
  const imgRef = useRef<HTMLImageElement>(null);
  const [fileList, setFileList] = useState([initialImg]);
  const onChange = async ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (imgRef?.current && reader.result) {
        imgRef.current.src = reader.result as string;
      }
    };

    if (!isUnderLimit(file.size, limitMB)) {
      message.error(`Upload File Size must under ${limitMB} MB!`);
    }
    if (!isAcceptImgType(file.type, acceptableTypes)) {
      message.error(`Type ${file.type} is not acceptable!`);
    }
    return false;
  };
  return (
    <ImgCrop shape="round">
      <Upload
        accept={acceptableTypes.join(', ')}
        maxCount={1}
        listType="text"
        fileList={fileList}
        onChange={onChange}
        beforeUpload={beforeUpload}
        onPreview={() => false}
      >
        <img
          ref={imgRef}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: fileList[0] ? 'initial' : 'none',
          }}
          src={fileList[0].url}
          alt="avatar"
        />
        {!fileList[0] ? '+ Upload' : ''}
      </Upload>
      {/* 组件样式按需加载，为了加载裁切modal页面的slider引入 */}
      <Slider style={{ display: 'none' }} />
    </ImgCrop>
  );
}
