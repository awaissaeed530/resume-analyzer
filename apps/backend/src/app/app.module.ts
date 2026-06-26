import { Module } from '@nestjs/common';
import { CoreModule } from './core';
import { FeaturesModule } from './features';

@Module({
  imports: [CoreModule, FeaturesModule],
})
export class AppModule {}
