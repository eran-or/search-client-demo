import React from 'react'
declare module "react" {
    function forwardRef<T, P = {}>(
      render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
    ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
  }
  
interface Props {
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    onKeyPress?:(e:React.KeyboardEvent<HTMLInputElement>)=>void;
    ref:React.ForwardedRef<HTMLInputElement>;
    boxRef:React.RefObject<HTMLInputElement>;
    children?: React.ReactNode;
    show:boolean;
    onFocus?:(e:React.FocusEvent<HTMLInputElement>)=>void;
    onBlur?:(e:React.FocusEvent<HTMLInputElement>)=>void;
    onClick:(e:React.MouseEvent)=>void;
}

function SearchBox ({onChange, children, show, onFocus, onBlur, onClick, boxRef, onKeyPress}:Props, ref:React.ForwardedRef<HTMLInputElement>) {
  
  return (
    <div className="w-[32rem] relative drop-shadow rounded border bg-white">
      <input className="w-full h-10 border rounded px-2 bg-white"
          id="q"
          name="q"
          aria-label="Search"
          ref={ref}
          type={"text"}
          onClick={onClick}
          onChange={onChange}
          onFocus={onFocus}
          spellCheck={false}
          onKeyPress={onKeyPress}
          autoComplete="off"
          onBlur={onBlur}
          aria-hidden={false} />
   
        {show&&<div ref={boxRef} className="w-full max-h-[260px] p-3 overflow-hidden bg-white absolute">
          {children}
          <button type='submit'>search</button>
        </div>}
   </div>
  )
}

export default React.forwardRef(SearchBox)