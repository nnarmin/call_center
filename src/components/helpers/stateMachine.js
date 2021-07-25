import {
    createMachine, state, transition, invoke, reduce,
} from 'robot3';

export const stateMachine = createMachine({
    initial: state(
        transition(
            'begin',
            'confirming',
            reduce((context, event) => ({
                ...context,
                onCommit: event.onCommit,
            })),
        ),
    ),
    confirming: state(
        transition('confirm', 'loading'),
        transition('cancel', 'initial'),
    ),
    loading: invoke((context, event) => context.onCommit(context, event),
        transition('done', 'initial'),
        transition('error', 'initial',
            reduce((context, event) => ({ ...context, error: event.error })))),
});
