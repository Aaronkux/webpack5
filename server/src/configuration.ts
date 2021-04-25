import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
import * as orm from '@midwayjs/orm';
import * as swagger from '@midwayjs/swagger';

@Configuration({
  imports: [
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
    orm, // 加载 orm 组件
  ],
  importConfigs: [join(__dirname, './config')],
  conflictCheck: true,
})
export class ContainerConfiguratin {}

export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  async onReady() {}
}
