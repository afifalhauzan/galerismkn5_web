"use client";

import React, { useEffect } from 'react';
import { HiX } from 'react-icons/hi';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
}) => {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (closeOnEscape && e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeOnEscape, onClose]);

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    // Size classes
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out"
                onClick={handleBackdropClick}
                aria-hidden="true"
            />
            
            {/* Modal Content */}
            <div className={`
                relative bg-white rounded-lg shadow-2xl mx-4 w-full ${sizeClasses[size]}
                transform transition-all duration-300 ease-out
                animate-in zoom-in-95 fade-in-0
            `}>
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        {title && (
                            <h3 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h3>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                                aria-label="Close modal"
                            >
                                <HiX className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                )}
                
                {/* Body */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

// Reusable Modal Body Components
export const ModalHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
    children, 
    className = "" 
}) => (
    <div className={`mb-4 ${className}`}>
        {children}
    </div>
);

export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
    children, 
    className = "" 
}) => (
    <div className={`mb-6 ${className}`}>
        {children}
    </div>
);

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
    children, 
    className = "" 
}) => (
    <div className={`flex justify-end space-x-2 pt-4 border-t border-gray-200 ${className}`}>
        {children}
    </div>
);