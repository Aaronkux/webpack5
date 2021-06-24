import React, { useEffect, useState } from 'react';
import { getImg } from '@/services/global';
import { Image, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface PropsType {
  path?: string;
  size?: number;
  isAvatar?: boolean;
  preview?: boolean;
}

const AuthImg = ({
  path,
  size = 48,
  isAvatar = false,
  preview = false,
  ...rest
}: PropsType) => {
  const [imgSrc, setImgSrc] = useState<string>();
  useEffect(() => {
    const test = async (path: string) => {
      const res = await getImg(path);
      const reader = new FileReader();
      reader.onload = function (e) {
        setImgSrc(e.target?.result as string);
      };
      reader.readAsDataURL(res);
    };
    if (path) {
      test(path);
    }
  }, []);
  return path ? (
    <Image
      {...rest}
      width={size}
      height={size}
      style={{
        borderRadius: isAvatar ? '50%' : 0,
      }}
      preview={preview}
      src={imgSrc}
    />
  ) : (
    <Avatar {...rest} size={size} icon={<UserOutlined />} />
  );
};

export default React.memo(AuthImg);
