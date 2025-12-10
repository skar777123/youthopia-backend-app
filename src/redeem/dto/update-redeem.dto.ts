import { PartialType } from '@nestjs/mapped-types';
import { CreateRedeemDto } from './create-redeem.dto';

export class UpdateRedeemDto extends PartialType(CreateRedeemDto) {}
