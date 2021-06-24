const If = ({test, children})=>  test? typeof children === 'function' ? children():children:null;
export default If