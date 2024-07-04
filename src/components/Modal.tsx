import React from 'react';

interface ModalProps {
    isOpen: boolean;
    
    children: React.ReactNode;
    
}

const Modal: React.FC<ModalProps> = ({ isOpen ,children}) => {
    
    if (!isOpen) return null;
    

    return (
        <div className="absolute bottom-1 top-32 left-96 inset-0 max-w-3xl max-h-fit rounded-lg bg-gray-200 bg-opacity-100 flex justify-center items-center">
            {children}

           
        </div>
    );
};

export default Modal;
