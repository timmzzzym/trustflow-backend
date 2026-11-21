import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Matches } from 'class-validator';
import { STELLAR_ADDRESS_REGEX } from '../escrow/escrow.dto';

/** Stellar's hard limit for text memo content, in bytes. */
export const STELLAR_MEMO_MAX_BYTES = 28;

export class BuildReleaseTransactionQueryDto {
  @ApiProperty({
    description: 'Stellar address that will sign and submit the transaction',
    example: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(STELLAR_ADDRESS_REGEX, { message: 'sourceAccount must be a valid Stellar address' })
  sourceAccount!: string;

  @ApiPropertyOptional({
    description:
      `Optional text memo to attach to the transaction. ` +
      `Must not exceed ${STELLAR_MEMO_MAX_BYTES} bytes when UTF-8 encoded — ` +
      `Stellar's hard limit for text memos.`,
    example: 'escrow-payout-ref-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(STELLAR_MEMO_MAX_BYTES, {
    message: `memo must not exceed ${STELLAR_MEMO_MAX_BYTES} characters`,
  })
  memo?: string;
}

export class BumpFeeBodyDto {
  @ApiProperty({
    description: 'XDR of the original unsigned release transaction to be fee-bumped',
    example: 'AAAAAgAAAAA...',
  })
  @IsString()
  @IsNotEmpty()
  unsignedInnerXdr!: string;

  @ApiProperty({
    description: 'New total fee in stroops — must exceed the inner transaction fee',
    example: '5000',
  })
  @IsString()
  @IsNotEmpty()
  @IsNumberString({}, { message: 'newFeeStroops must be a numeric string' })
  newFeeStroops!: string;

  @ApiProperty({
    description: 'Stellar address that will pay the bump fee and sign the fee-bump envelope',
    example: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(STELLAR_ADDRESS_REGEX, { message: 'feeAccount must be a valid Stellar address' })
  feeAccount!: string;
}
