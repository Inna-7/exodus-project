import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const success: boolean = searchParams.get("success") === 'true';
  const message: string = searchParams.get("message") || '';


  useEffect(() => {
    if (searchParams.get("success")) {
      Swal.fire({
        title: "Verification",
        text: message,
        icon: success ? 'success' : 'error',
        confirmButtonText: 'Go to Sign in',
        confirmButtonColor: success ? '#82dc3c' : '#ef4444',
        backdrop: '#c8c8c8',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login')
        }
      })
    }
    else {
      navigate('/login')
    }
  }, [])

  return <div className="absolute z-50 w-full h-screen bg-white mt-[-88px]"></div>
}

export default VerifyEmailPage;