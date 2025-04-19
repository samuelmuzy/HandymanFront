interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay com fundo escuro semi-transparente e desfoque */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all"
        onClick={onClose}
      />
      
      {/* Conteúdo do Modal */}
      <div className="bg-[#FFF8F1] rounded-3xl p-6 w-[85%] max-w-[400px] z-10">
        {children}
      </div>
    </div>
  );
}; 