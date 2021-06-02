import React, { useRef } from 'react';
import { Upload, message } from 'antd';
import type { RcFile } from 'antd/lib/upload/interface';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import AuthImg from '@/components/AuthImg';
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
  size?: number;
  disabled?: boolean;
  [props: string]: any;
}

export default function UploadAvatar({
  acceptableTypes = ['image/jpeg', 'image/png'],
  limitMB = 5,
  value,
  onChange,
  size = 48,
  disabled = false,
  ...res
}: PropsType) {
  const imgRef = useRef<HTMLImageElement>(null);
  const beforeUpload = (file: RcFile) => {
    if (!isUnderLimit(file.size, limitMB)) {
      message.error(`Upload File Size must under ${limitMB} MB!`);
      return false;
    }
    if (!isAcceptImgType(file.type, acceptableTypes)) {
      message.error(`Type ${file.type} is not acceptable!`);
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (imgRef?.current && reader.result) {
        imgRef.current.src = reader.result as string;
      }
    };
    onChange?.(file);
    return false;
  };
  return (
    <ImgCrop shape="round">
      <Upload
        disabled={disabled}
        {...res}
        accept={acceptableTypes.join(', ')}
        maxCount={1}
        listType="text"
        beforeUpload={beforeUpload}
        onPreview={() => false}
        className={styles.container}
      >
        {typeof value === 'string' || !value ? (
          <AuthImg isAvatar size={size} path={value} />
        ) : (
          <img
            ref={imgRef}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              cursor: 'pointer',
            }}
            alt="avatar"
          />
        )}
      </Upload>
    </ImgCrop>
  );
}
