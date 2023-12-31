import { Logger } from 'ethers/lib/utils';

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error instanceof Object && (error as any).message) return String((error as any).message);
  return String(error);
}

export function tryToGetErrorData(error: any):
  | {
      title: string;
      description?: string;
    }
  | undefined {
  const message = getErrorMessage(error);

  // rejected by user
  if (error.code === 4001) {
    return undefined;
  }

  if (error.code === Logger.errors.TRANSACTION_REPLACED) {
    if (error.cancelled) {
      return { title: 'Failed', description: 'Transaction cancelled' };
    }
  }

  if (message.includes('user rejected transaction')) {
    return { title: 'Failed', description: 'Rejected by user' };
  }

  if (message.includes('transaction underpriced')) {
    return { title: 'Failed', description: 'Transaction underpriced. Please try again' };
  }

  if (message.includes('amount exceeds balance')) {
    return { title: 'Failed', description: 'Not enough funds in your wallet' };
  }

  if (message.includes('Referrer')) {
    return { title: 'Failed', description: 'This address cannot be the leader' };
  }

  if (message.includes('Not enough tokens in pool')) {
    return {
      title: 'Failed',
      description: 'There are not enough funds in the pool',
    };
  }
  if (message.includes('Not enough tokens in exchange pool')) {
    return {
      title: 'Failed',
      description: 'There are not enough funds in the pool for exchange',
    };
  }
  if (message.includes('Not enough tokens for reward')) {
    return {
      title: 'Failed',
      description: 'There are not enough funds in the pool to pay the rewards',
    };
  }
  if (message.includes('Whitelist')) {
    return {
      title: 'Failed',
      description: 'Token Whitelist restriction: sender or receiver address is not in whitelist',
    };
  }
  if (message.includes('Blacklist')) {
    return {
      title: 'Failed',
      description: 'Token Blacklist restriction: sender or receiver address is in blacklist',
    };
  }
  if (message.includes('Pausable: paused')) {
    return { title: 'Failed', description: 'Token has been paused' };
  }
  if (message.includes('underlying network changed')) {
    return {
      title: 'Failed',
      description: 'Unsupported network',
    };
  }
  if (message.includes('reverted with reason string ')) {
    const errorReg = /reverted with reason string '(?<data>[^']*)'/gm;
    const res = Array.from(message.matchAll(errorReg));

    if (res && res[0] && res[0][1]) {
      return { title: 'Failed', description: `Error: ${res[0][1]}` };
    }
  }

  // For local development mostly
  if (message.includes('Expected nonce to be')) {
    const expectedNonce = message.split('Expected nonce to be')[1].trim().split(' ')[0];
    return { title: 'Wrong nonce', description: `Expected nonce ${expectedNonce}` };
  }

  return { title: 'Transaction failed', description: 'Something went wrong' };
}
