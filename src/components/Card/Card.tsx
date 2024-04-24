import React from "react";

interface IProps {
    children: React.ReactNode;
    imgSrc?: string;
    style?: React.CSSProperties;
    className?: string;
    imgStyle?: React.CSSProperties;
    footer?: React.ReactNode;
}

{
    /* <div className="card w-96 bg-base-100 shadow-xl image-full">
  <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
  <div className="card-body">
    <h2 className="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div> */
}

const Card = ({ children, imgSrc, style, className = "w-96 bg-base-100 shadow-xl image-full", imgStyle, footer }: IProps) => {
    return (
        <>
            <div className={`card ${className}`} style={style}>
                {imgSrc && (
                    <figure>
                        <img src={imgSrc} style={imgStyle} />
                    </figure>
                )}
                <div className="card-body">
                    {children}
                    {footer && <div className="card-actions justify-end">{footer}</div>}
                </div>
            </div>
        </>
    );
};

export default Card;
