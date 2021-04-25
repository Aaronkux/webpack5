import { Rule, RuleType } from '@midwayjs/decorator';

export class UserCreateDTO {
  // @Rule(RuleType.number().required())
  // id: number;

  @Rule(RuleType.string().required())
  firstname: string;

  @Rule(RuleType.string().required())
  lastname: string;

  @Rule(RuleType.string().required())
  email: string;

  @Rule(RuleType.boolean().required())
  isActive: boolean;
}
