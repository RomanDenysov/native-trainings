import { View, Button } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";

const Page = () => {
	const router = useRouter();
	return (
		<View>
			<Button
				onPress={() => router.push("/register")}
				title="Open register"
			/>
			<Link href={"/register"} asChild>
				<Button title="Open REGISTER w/ Link" />
			</Link>
			<Link href={"/(tabs)/one"} replace asChild>
				<Button title="Login" />
			</Link>
		</View>
	);
};

export default Page;
