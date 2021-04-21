import React, { useRef, useState } from 'react';
import { Modal, Upload, message } from 'antd';
import type { UploadFile, RcFile } from 'antd/lib/upload/interface';

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

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
  disabled?: boolean
}

export default function UploadPicture({
  acceptableTypes = ['image/jpeg', 'image/png'],
  limitMB = 5,
  value,
  onChange,
  disabled
}: PropsType) {
  const [visible, setVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
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

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || file.preview);
    setVisible(true);
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
    <div>
      <Upload
        disabled={disabled}
        accept={acceptableTypes.join(', ')}
        maxCount={1}
        listType="picture-card"
        fileList={fileList}
        onChange={onChangeHandler}
        beforeUpload={beforeUpload}
        onPreview={onPreview}
      >
        {fileList.length < 1 && '+ Upload'}
      </Upload>
      <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
