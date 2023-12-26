import { Link, Slot } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useState } from "react";
import { Platform, Pressable, Text } from "react-native";

const Layout = () => {
	const [hover, setHover] = useState<number | undefined>();
	const handleHover = (index: number | undefined) => {
		setHover(index);
	};

	if (Platform.OS === "web") {
		return (
			<div style={{ flex: 1 }}>
				<header>
					<div
						style={{
							display: "flex",
							gap: 10,
							padding: 10,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "#c7c7c7",
						}}
					>
						<Link href={"/page1"} asChild>
							<Pressable
								onHoverIn={() => handleHover(0)}
								onHoverOut={() => handleHover(undefined)}
							>
								<Text
									style={{ color: hover === 1 ? "blue" : "" }}
								>
									News
								</Text>
							</Pressable>
						</Link>
						<Link href={"/page2"} asChild>
							<Pressable
								onHoverIn={() => handleHover(0)}
								onHoverOut={() => handleHover(undefined)}
							>
								<Text
									style={{ color: hover === 1 ? "blue" : "" }}
								>
									Page 2
								</Text>
							</Pressable>
						</Link>
					</div>
				</header>
				<Slot />
			</div>
		);
	} else {
		return (
			<Drawer>
				<Drawer.Screen
					name="page1"
					options={{
						headerTitle: "My Newsfeed",
						drawerLabel: "News",
					}}
				/>
			</Drawer>
		);
	}
};

export default Layout;
