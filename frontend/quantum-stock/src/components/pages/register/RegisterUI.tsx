import RegisterForm from '@/components/forms/RegisterForm';
import { Link } from '@heroui/link';

export default function RegisterUI() {
	return (
		<main className="flex flex-row w-screen h-screen gap-y-6">
			{/* Left side */}
			<div className="container relative flex-col-reverse hidden w-1/2 h-[88vh] p-10 my-4 overflow-hidden bg-center bg-cover mx-7 rounded-medium shadow-small lg:flex bg-hero-background-3">
				<div className="flex flex-col items-start gap-4">
					<p className="w-full text-2xl text-left text-white">
						<span className="font-medium">"</span>
						<span className="italic font-normal">
							Únete a QuantumStock — La forma inteligente de gestionar tus
							productos.
						</span>
						<span className="font-medium">"</span>
					</p>
				</div>
			</div>

			{/* Login Form */}
			<div className="container flex items-center justify-center w-full lg:w-1/2">
				<div className="flex flex-col items-center w-full max-w-md gap-4 px-4 py-12 border shadow-lg bg-background rounded-medium">
					<div className="w-full text-left">
						<p className="pb-2 text-2xl font-medium text-center text-primary">
							Welcome to Santiago Solar Roof
						</p>
						<p className="text-center text-medium text-default-800">
							Join our platform and start analyzing solar potential in Santiago!
						</p>
					</div>
					<RegisterForm />

					<p className="text-center text-medium">
						Already have an account?&nbsp;
						<Link href="/auth/Login" size="sm">
							Log In
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
