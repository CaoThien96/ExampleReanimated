import Reactotron, { networking } from 'reactotron-react-native';

if (__DEV__) {
    // const emitter = new EventEmitter();

    // const events = Snoopy.stream(emitter);
    // filter({ type: Snoopy.TO_NATIVE }, true)(events).subscribe();
    // filter({ method: 'updateView' }, true)(events).subscribe();
    // bars()(buffer()(events)).subscribe();

    // https://github.com/infinitered/reactotron for more options!
    Reactotron.configure({ name: 'equix' })
        .useReactNative({
            networking: false
        })
        .connect();

    // Let's clear Reactotron on every time we load the app
    Reactotron.clear();

    // Totally hacky, but this allows you to not both importing reactotron-react-native
    // on every file.  This is just DEV mode, so no big deal.
    console.info = Reactotron.log;
}
