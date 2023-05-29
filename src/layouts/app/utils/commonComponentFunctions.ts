
export type EmitFn = (event: "closeComp") => void;

export function useCommonComponentFunctions(emit: EmitFn) {
  const closeComponent = () => {
    console.log("Close component");
    emit("closeComp");
  };

  return { closeComponent };
}
