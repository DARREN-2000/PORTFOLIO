import {
	ODSText,
	ODSColumn,
	ODSRow,
	ODSButton,
	ODSLink,
	ODSLogo,
	ODSCheckbox,
	ODSDivider,
	ODSTextField,
} from "@telekom-ods/react-ui-kit";


import "./login.css";

function Login() {
	return (
		<>
			<ODSColumn className="login-plugin-login-container">
				<ODSLogo variant="primary" />
				<ODSColumn className="login-plugin-text-container">
					{/* TODO: Add the proper html tag under 'as' property */}
					<ODSText as="span" className="login-plugin-header-text-container">
						ODS v2.2.3 Template
					</ODSText>
					{/* TODO: Add the proper html tag under 'as' property */}
					<ODSText as="span" className="login-plugin-subheader-text-container">
						Please sign in to the workshop
					</ODSText>
				</ODSColumn>
				<ODSColumn className="login-plugin-content-container">
					<ODSColumn className="login-plugin-credentials-container">
						<ODSTextField 
							className="login-plugin-ods-text-field-container" 
							labelText="Username" 
							mode="standard" 
							readOnly={false} 
							required={true} 
						/>
						<ODSTextField 
							className="login-plugin-ods-text-field-container" 
							labelText="Password" 
							mode="standard" 
							type="password" 
							readOnly={false} 
							required={true} 
							rightIconValue="visibility-on-type-standard" 
						/>
						<ODSRow className="login-plugin-remember-me-password-container">
							<ODSCheckbox 
								label="Remember me" 
								mode="standard" 
								readOnly={false} 
								size="small" 
							/>
							<ODSLink label="Forgot password?" variant="primary" />
						</ODSRow>
					</ODSColumn>
					<ODSColumn className="login-plugin-buttons-container">
						<ODSButton 
							className="login-plugin-ods-button-container" 
							buttonType="standard" 
							label="Sign in" 
							leftIcon={false} 
							rightIcon={false} 
							size="large" 
							variant="primary" 
						/>
						<ODSRow className="login-plugin-divider-container-container">
							<ODSDivider 
								className="login-plugin-ods-divider-container" 
								inset={false} 
								spacing={false} 
								type="horizontal" 
							/>
							{/* TODO: Add the proper html tag under 'as' property */}
							<ODSText as="span" className="login-plugin-or-text-container">
								or
							</ODSText>
							<ODSDivider 
								className="login-plugin-ods-divider-container" 
								inset={false} 
								spacing={false} 
								type="horizontal" 
							/>
						</ODSRow>
						<ODSButton 
							className="login-plugin-ods-button-container" 
							buttonIcon="apple-type-bold" 
							buttonType="standard" 
							label="Sign in with Apple iD" 
							leftIcon={true} 
							rightIcon={false} 
							size="large" 
							variant="outline" 
						/>
					</ODSColumn>
					<ODSRow className="login-plugin-sign-up-container">
						{/* TODO: Add the proper html tag under 'as' property */}
						<ODSText as="span" className="login-plugin-sign-up-prompt-text-text-container">
							Not yet a member?
						</ODSText>
						<ODSLink label="Sign up" variant="primary" />
					</ODSRow>
				</ODSColumn>
			</ODSColumn>
		</>
	);
}

export default Login;
