import { ConfigModuleOptions } from '@nestjs/config';
import { configValidationSchema } from '@shared/config/config.schema';

const configModuleOptions: ConfigModuleOptions = {
  envFilePath: [`.env.stage.${process.env.STAGE}`],
  validationSchema: configValidationSchema
};

export default configModuleOptions;
