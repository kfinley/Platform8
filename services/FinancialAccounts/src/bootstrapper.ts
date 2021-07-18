import 'reflect-metadata';
import { bootstrapper as awsCommandsBootstrapper } from '@platform8/aws-commands/src';

export default function bootstrapper() {
  awsCommandsBootstrapper();
}
