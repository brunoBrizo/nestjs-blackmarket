import { ConfigModuleOptions } from '@nestjs/config';
import { configValidationSchema } from '@shared/config';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: [`.env.stage.${process.env.STAGE}`],
  validationSchema: configValidationSchema
};
