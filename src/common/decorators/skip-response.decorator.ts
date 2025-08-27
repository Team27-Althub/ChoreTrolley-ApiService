import { SetMetadata } from '@nestjs/common';

export const SKIP_RESPONSE_WRAPPER = 'skipResponseWrapper';
export const SkipResponseWrapper = () =>
  SetMetadata(SKIP_RESPONSE_WRAPPER, true);
