import React, { ChangeEvent } from "react";
import Input from "../FormElements/Input";

function SignupForm({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  btnText,
  error,
}) {
  return (
    <form className="" onSubmit={onSubmit}>
      {error && <div className="text-red-600 text-sm">*{error}</div>}
      <Input
        type="text"
        label="Username"
        id="signUpUsername"
        name="username"
        className="mb-6"
        placeholder="Username"
        value={username}
        handleChange={(event: ChangeEvent<HTMLInputElement>) => {
          setUsername(event.target.value);
        }}
      />
      <Input
        type="email"
        label="Email"
        id="signUpEmail"
        name="email"
        className="mb-4"
        placeholder="Email"
        value={email}
        handleChange={(event: ChangeEvent<HTMLInputElement>) => {
          setEmail(event.target.value);
        }}
      />
      <Input
        type="password"
        label="Password"
        id="signUpPassword"
        name="password"
        className="mb-6"
        placeholder="Password"
        value={password}
        handleChange={(event: ChangeEvent<HTMLInputElement>) => {
          setPassword(event.target.value);
        }}
      />
      <div>
        <button className="btn btn-yellow w-full">{btnText}</button>
      </div>
    </form>
  );
}

export default SignupForm;
