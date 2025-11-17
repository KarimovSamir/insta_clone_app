import { Router } from 'express';
import { appContainer } from '../../core/ioc/app.container';
import { TYPES } from '../../core/ioc/types';
import { TestingController } from '../controllers/testing.controller';

export const testingRouter = Router({});

const testingController = appContainer.get<TestingController>(
  TYPES.TestingController,
);

testingRouter.delete('/all-data', testingController.deleteAllData);