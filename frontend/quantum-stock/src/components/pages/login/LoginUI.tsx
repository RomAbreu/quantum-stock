import LoginForm from '@/components/forms/LoginForm';
import { Link } from '@heroui/link';

export default function LoginUI() {
	return (
		<main className="flex flex-row w-screen h-screen gap-y-6">
			{/* Login Form */}
			<div className="container flex items-center justify-center w-full lg:w-1/2">
				<div className="flex flex-col items-center w-full max-w-md gap-4 px-4 py-12 border shadow-lg bg-background rounded-medium">
					<div className="w-full text-left">
						<p className="pb-2 text-2xl font-medium text-center text-primary">
							Welcome Back
						</p>
						<p className="text-center text-medium text-default-800">
							Log in to your account to continue
						</p>
					</div>
					<LoginForm />

					<p className="text-center text-medium">
						Need to create an account?&nbsp;
						<Link href="/auth/signup" size="sm">
							Sign Up
						</Link>
					</p>
				</div>
			</div>

			{/* Right side */}
			<div className="container relative h-[88vh] flex-col-reverse hidden w-1/2 p-10 my-4 overflow-hidden bg-center bg-cover mx-7 rounded-medium shadow-small lg:flex bg-hero-background-2">
				<div className="flex flex-col items-end gap-4">
					<p className="w-full text-2xl text-right text-white">
						<span className="font-medium">"</span>
						<span className="italic font-normal">
							Bienvenido a QuantumStock — Controla tu inventario, domina tu
							negocio.
						</span>
						<span className="font-medium">"</span>
					</p>
				</div>
			</div>
		</main>
	);
}
