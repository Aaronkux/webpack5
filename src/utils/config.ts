const config: { layouts: LayoutConfig[] } = {
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|zh))*\/login/],
    },
  ],
};
export interface LayoutConfig {
  name: 'primary' | 'public';
  include: RegExp[];
  exclude: RegExp[];
}

export default config;
