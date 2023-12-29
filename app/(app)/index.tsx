import {
	View,
	Text,
	StyleSheet,
	SectionList,
	ListRenderItem,
	TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { supabase } from "../../config/initSupabase";
import BottomGrocerySheet from "../../components/BottomGrocerySheet";
import { Ionicons } from "@expo/vector-icons";

const Page = () => {
	const { user } = useAuth();
	const [listItems, setListItems] = useState<any[]>([]);
	const [groceryOptions, setGroceryOptions] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			let { data: categories } = await supabase
				.from("categories")
				.select(`id, category`);
			const { data: products } = await supabase
				.from("products")
				.select()
				.eq("historic", false);
			const { data: historic } = await supabase
				.from("products")
				.select()
				.eq("historic", true);

			if (historic) {
				const combinedHistoric = [
					...historic.map((item: any) => item.name),
					...groceryOptions,
				];
				const uniqueHistoric = [...new Set(combinedHistoric)];
				setGroceryOptions(uniqueHistoric);
			}

			if (products) {
				const grouped: any = categories?.map((category: any) => {
					const items = products.filter(
						(product: any) => product.category === category.id
					);
					return { ...category, data: items };
				});
				setListItems(grouped);
			}
		};
		fetchData();
	}, []);

	const setItems = async (newItemData: any, categoryId: number) => {
		console.log("TEST function", newItemData);
		return setListItems((prevListItem) =>
			prevListItem.map((category) =>
				category.id === categoryId
					? {
							...category,
							data: [...category.data, newItemData],
					  }
					: category
			)
		);
	};
	const exItems = async (data: any) => {
		console.log("EXITEMS:", data);
		await supabase
			.from("products")
			.update({ historic: false })
			.eq("name", data.name)
			.select();
		return setListItems((prev) => [...prev]);
	};

	const onAddItem = async (name: string, categoryId: number) => {
		try {
			const { data, error } = await supabase
				.from("products")
				.select("*")
				.eq("name", name)
				.eq("category", categoryId)
				.single();
			console.log("DATA:", data);

			// return data ? exItems(data) : setItems(data, categoryId, name);

			if (error || !data) {
				console.log("Error req to db", error);
			}
			if (data) {
				await exItems(data);
			} else {
				const insertResult = await supabase
					.from("products")
					.insert([{ name, category: categoryId, user_id: user?.id }])
					.select();
				console.log("Here is a RES: ", insertResult);
				if (insertResult.data) {
					setItems(insertResult.data, categoryId);
				}
			}
		} catch (error) {
			console.log("ON ADD ITEM:", error);
		}
	};

	const renderGroceryRow: ListRenderItem<any> = ({ item: grocery }) => {
		const onSelect = async () => {
			const result = await supabase
				.from("products")
				.update({ historic: true })
				.eq("id", grocery.id)
				.select();
			console.log("ON SELECT REMOVING", result);
			const category = listItems.find(
				(category) => category.id === grocery.category
			);
			if (category) {
				category.data = category.data.filter(
					(item: any) => item.id !== grocery.id
				);
				return setListItems((prev) => [...prev]);
			}
		};

		return (
			<TouchableOpacity style={styles.groceryRow} onPress={onSelect}>
				<Text style={styles.groceryName}>{grocery.name}</Text>
				<Ionicons name="checkmark" size={24} color="white" />
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			{listItems.length > 0 && (
				<SectionList
					renderSectionHeader={({ section }) => (
						<Text style={styles.sectionHeader}>
							{section.category}
						</Text>
					)}
					contentContainerStyle={{ paddingBottom: 150 }}
					sections={listItems}
					renderItem={renderGroceryRow}
				/>
			)}
			<BottomGrocerySheet
				groceryOptions={groceryOptions}
				onItemSelected={(item, category) => onAddItem(item, category)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#2a2a2a",
	},
	sectionHeader: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
		marginHorizontal: 16,
		marginTop: 20,
	},
	groceryRow: {
		flexDirection: "row",
		backgroundColor: "#2b825b",
		padding: 10,
		marginHorizontal: 16,
		marginVertical: 4,
		borderRadius: 4,
	},
	groceryName: {
		color: "#fff",
		fontSize: 20,
		flex: 1,
	},
});

export default Page;
