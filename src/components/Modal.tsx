import React from 'react';

interface ModalProps {
    isOpen: boolean;
    
    children: React.ReactNode;
    
}

const Modal: React.FC<ModalProps> = ({ isOpen ,children}) => {
    
    if (!isOpen) return null;
    

    return (
        <div className="absolute bottom-1 top-32 left-96 inset-0 max-w-3xl max-h-fit rounded-lg bg-gray-200 bg-opacity-100 flex justify-center items-center">
            {/* <div className="bg-white rounded-lg p-4 w-1/2">
                <button onClick={onClose} className="float-right">X</button>
                
            </div> */}
            {children}

           
        </div>
    );
};

export default Modal;
