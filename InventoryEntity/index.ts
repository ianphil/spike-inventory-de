import * as df from 'durable-functions';

const entityFunction = df.entity((context) => {
  const event = context.df.getInput() as any;

  const currentState = context.df.getState(() => {
    return { amount: 0 };
  });
  switch (context.df.operationName) {
    case 'add':
      const amount = event.amount;
      // @ts-ignore
      currentState.amount += amount;
      context.df.setState(currentState);
      break;
    case 'reset':
      context.df.setState({ amount: 0 });
      break;
    case 'get':
      context.df.return(currentState);
      break;
  }
});

export default entityFunction;
