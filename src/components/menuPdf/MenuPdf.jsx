import "./MenuPdf.css";
import Pdf from '../../assets/Pdf/Menu beyon.pdf'

const MenuPdf = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const handleDownload = () => {
        window.open(Pdf, '_blank');
    };
    return (
        <div className="pdf-container">
            {!isMobile ? (
                <iframe
                    src={Pdf}
                    className="pdf-iframe"
                    title="Menu PDF"
                />
            ) : (
                <button className="download-button" onClick={handleDownload}>
                    Descargar Menú
                </button>
            )}
        </div>
    );
};

export default MenuPdf;