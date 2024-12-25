import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  pdf,
  StyleSheet,
} from "@react-pdf/renderer";

// Define the styles for the PDF using react-pdf's StyleSheet
const styles = StyleSheet.create({
  page: {
    padding: "10px", // Reduced padding further
  },
  header: {
    textAlign: "center",
    fontSize: 16, // Further reduced font size for header
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "black",
    color: "white",
    padding: 3, // Further reduced padding
  },
  table: {
    width: "100%",
    marginTop: 5,
    border: "1px solid #cccccc",
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #cccccc",
  },
  tableCell: {
    padding: "3px", // Further reduced padding inside the table cells
    borderRight: "1px solid #cccccc",
    textAlign: "center",
    width: "20%", // Adjusted width for a more compact layout
  },
  imageCell: {
    width: "20%",
    height: 60, // Reduced height of image cells
    textAlign: "center",
    verticalAlign: "middle",
    border: "1px solid #cccccc",
    padding: 1, // Reduced padding in image cell
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 3,
  },
});

const MyDocument = ({ order }) => (
  <Document>
    <Page style={styles.page} size={[600, 500]}>
      {" "}
      {/* Custom page size: width 600px and height 500px */}
      {/* Header */}
      <Text style={styles.header}>Order Details</Text>
      <Text style={{ marginBottom: 3 }}>Order ID: {order._id}</Text>
      <Text style={{ marginBottom: 3 }}>Total Cost: ${order.totalCost}</Text>
      <Text style={{ marginBottom: 3 }}>
        Payment Method: {order.paymentMethod}
      </Text>
      <Text style={{ marginBottom: 8 }}>
        Date: {new Date(order.date).toLocaleString()}
      </Text>
      <Text style={{ marginBottom: 5 }}>Items:</Text>
      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "10%" }]}>#</Text>
          <Text style={[styles.tableCell, { width: "20%" }]}>Image</Text>
          <Text style={[styles.tableCell, { width: "30%" }]}>Model</Text>
          <Text style={[styles.tableCell, { width: "20%" }]}>Price</Text>
          <Text style={[styles.tableCell, { width: "20%" }]}>Quantity</Text>
        </View>

        {/* Table Rows */}
        {order.cartItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "10%" }]}>
              {index + 1}
            </Text>

            {/* Image Cell */}
            <View style={styles.imageCell}>
              {item.imageUrls && item.imageUrls.length > 0 ? (
                <Image src={item.imageUrls[0]} style={styles.image} />
              ) : (
                <Text>No Image</Text>
              )}
            </View>

            {/* Model Cell */}
            <Text style={[styles.tableCell, { width: "30%" }]}>
              {item.model}
            </Text>

            {/* Price Cell */}
            <Text style={[styles.tableCell, { width: "20%" }]}>
              ${item.price}
            </Text>

            {/* Quantity Cell */}
            <Text style={[styles.tableCell, { width: "20%" }]}>
              {item.quantity}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export const downloadPDF = (order) => {
  // Generate the PDF document
  pdf(<MyDocument order={order} />)
    .toBlob()
    .then((blob) => {
      // Create a link to download the PDF file
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "order_details.pdf";
      link.click();
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    });
};
