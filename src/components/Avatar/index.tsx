import React, { useRef, useState } from 'react';
import { Upload, Slider, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/lib/upload/interface';
import ImgCrop from 'antd-img-crop';
import styles from './index.less';

const isUnderLimit = (size: number, limitMB: number) => {
  if (size / 1024 / 1024 < limitMB) return true;
  return false;
};

const isAcceptImgType = (type: string, acceptableTypes: string[]) => {
  if (acceptableTypes.includes(type)) return true;
  return false;
};

interface PropsType {
  acceptableTypes?: string[];
  limitMB?: number;
  value?: string | File;
  onChange?: (value: File) => void;
  [props: string]: any
}

export default function UploadAvatar({
  acceptableTypes = ['image/jpeg', 'image/png'],
  limitMB = 5,
  value,
  onChange,
  ...res
}: PropsType) {
  const extension = typeof value === 'string' ? value.split('.').pop() : '';
  const initialextension = extension ? `image/${extension ?? 'jpeg'}` : '';
  const initialImgName = extension ? `avatar.${extension ?? 'jpg'}` : '';
  const initialImg: UploadFile = {
    uid: '-1',
    name: initialImgName,
    status: 'done',
    url: typeof value === 'string' ? value : '',
    type: initialextension,
    size: 1,
  };

  const imgRef = useRef<HTMLImageElement>(null);
  const [fileList, setFileList] = useState(() =>
    typeof value === 'string' ? [initialImg] : [],
  );
  const onChangeHandler = async ({
    file,
    fileList: newFileList,
  }: {
    file: UploadFile;
    fileList: UploadFile[];
  }) => {
    onChange?.(file.originFileObj as File);
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
        {...res}
        accept={acceptableTypes.join(', ')}
        maxCount={1}
        listType="text"
        fileList={fileList}
        onChange={onChangeHandler}
        beforeUpload={beforeUpload}
        onPreview={() => false}
        className={styles.container}
      >
        {fileList.length > 0 ? (
          <img
            ref={imgRef}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: fileList[0] ? 'initial' : 'none',
            }}
            src={fileList[0].url}
            alt="avatar"
          />
        ) : (
          <Avatar size={64} icon={<UserOutlined />} />
        )}
      </Upload>
      <Slider style={{ display: 'none' }} />
    </ImgCrop>
  );
}
