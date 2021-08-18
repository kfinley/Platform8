import 'reflect-metadata';
import { container } from 'inversify-props';
import { bootstrapper as awsCommandsBootstrapper } from '@platform8/aws-commands/src';

export default function bootstrapper() {
  awsCommandsBootstrapper(container);
}
