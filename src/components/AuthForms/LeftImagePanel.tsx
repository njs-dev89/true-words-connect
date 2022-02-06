import * as React from "react";
import Image from "next/image";

function LeftImagePanel({ children, imgSrc }) {
  return (
    <div className="signup-banner py-32">
      <div className="container-sm grid md:grid-cols-2 md:gap-32">
        <div className="col-span-1 hidden md:block">
          <div className="relative h-96">
            <Image src={imgSrc} alt="" layout="fill" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default LeftImagePanel;
