import * as df from 'durable-functions';

const entityFunction = df.entity((context) => {
  const currentValue = context.df.getState(() => 0);
  switch (context.df.operationName) {
    case 'add':
      const amount = context.df.getInput();
      // @ts-ignore
      context.df.setState(currentValue + amount);
      break;
    case 'reset':
      context.df.setState(0);
      break;
    case 'get':
      context.df.return(currentValue);
      break;
  }
});

export default entityFunction;
