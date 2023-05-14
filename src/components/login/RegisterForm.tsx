import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthContext from "src/shared/context/auth-context";
import Modal from "src/shared/components/utils/Modal";
import InputField from "src/shared/components/form-elements/InputField";

type Props = {
  handleError: (error: string | null) => void;
};

const RegisterForm = ({ handleError }: Props) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/users/register`,
        {
          email,
          password,
          firstName,
          lastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response.data;
      login(responseData.token, responseData.expiresIn, responseData.user);
      navigate("/home");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        handleError(error.response?.data.error);
      } else {
        console.error("Unexpected error: ", error);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      {windowWidth < 1024 && (
        <div className='fixed inset-0 z-[-1]'>
          <img
            src='../src/assets/svg/gradient-background.svg'
            alt='Background'
            className='h-full w-full object-cover'
          />
        </div>
      )}
      <Modal onCancel={() => setError(null)} header='An error occurred!' show={!!error} isError={!!error}>
        <p>{error}</p>
      </Modal>
      {windowWidth < 1024 && (
        <div className='h-20'>
          <img src='../src/assets/svg/logo.svg' alt='Logo' className='mx-auto mb-3 h-[150px] w-[300px] pb-20' />
        </div>
      )}
      <div className='w-[450px] text-center'>
        <h2 className='mb-[42px] font-gilroy-semi-bold text-[32px] font-semibold leading-10 text-midnight-grey'>
          Register
        </h2>
        <form className='mb-[17px] flex flex-col items-center justify-center text-base' onSubmit={handleFormSubmit}>
          <InputField
            label='Email'
            htmlFor='email'
            type='email'
            id='email'
            placeholder='Enter your email'
            value={email}
            required={true}
            handleInput={(email) => setEmail(email)}
          />
          <InputField
            label='First name'
            htmlFor='First name'
            type='text'
            id='firstName'
            placeholder='Enter your first name'
            value={firstName}
            required={true}
            handleInput={(firstName) => setFirstName(firstName)}
          />
          <InputField
            label='Last name'
            htmlFor='Last name'
            type='text'
            id='lastName'
            placeholder='Enter your last name'
            value={lastName}
            required={true}
            handleInput={(lastName) => setLastName(lastName)}
          />
          <InputField
            label='Password'
            htmlFor='password'
            type='password'
            id='password'
            placeholder='Enter your password'
            value={password}
            required={true}
            handleInput={(password) => setPassword(password)}
          />
          <button
            className='mt-[13px] w-full rounded-md bg-deep-teal py-3 pl-3 font-gilroy-semi-bold font-semibold text-white hover:saturate-[400%]'
            type='submit'
          >
            Register
          </button>
        </form>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center justify-start gap-[9px]'></div>
        </div>
        <div className='block h-2'></div>
        <a
          className='font-gilroy-medium font-medium tracking-[-0.015em] text-deep-teal underline'
          href='#'
          onClick={() => navigate("/login")}
        >
          Return to login
        </a>
      </div>
    </div>
  );
};

export default RegisterForm;
