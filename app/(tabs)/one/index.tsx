import { Button, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Page = () => {
	return (
		<View>
			<Link href={"/"} replace asChild>
				<Button title="Logout" />
			</Link>
			<Link href={"/(tabs)/one/details"} asChild>
				<Button title="Open Details" />
			</Link>

			<Link href={"/(tabs)/one/42"} asChild>
				<Button title="Open Details 42" />
			</Link>
			<Link href={"/(tabs)/one/133"} asChild>
				<Button title="Open Details 133" />
			</Link>
			<Link href={"/modal"} asChild>
				<Button title="Open Modal" />
			</Link>
			<Link href={"/(aux)/disclaimer"} asChild>
				<Button title="Open Disclaimer" />
			</Link>
		</View>
	);
};

export default Page;
