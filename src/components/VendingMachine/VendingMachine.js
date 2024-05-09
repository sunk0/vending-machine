import React, { useEffect, useState } from "react";
import VendingButton from "../VendingButton";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Snackbar,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 100%;
  width: 800px;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Form = styled.form`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const ITEMS_URL = "http://localhost:3001/items";
const COINS_MAP = [0.1, 0.2, 0.5, 1, 2];
const CURRENCIES_MAP = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "EUR",
    label: "€",
  },
  {
    value: "LEV",
    label: "lev",
  },
];

const VendingMachine = () => {
  const [initialItems, setInitialItems] = useState([]);
  const [items, setItems] = useState([]);
  const [insertedSum, setInsertedSum] = useState(0);
  const [price, setPrice] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetch(ITEMS_URL)
      .then((res) => res.json())
      .then((data) => {
        setInitialItems(data.products);
        setItems(data.products);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setInsertedSum(insertedSum + selectedCoin);
  };

  const handleAddItemToBuy = (item) => {
    setPrice(price + item.price);
    const newItems = items.map((el) => {
      if (el.id === item.id && el.quantity > 0) {
        return { ...el, quantity: el.quantity - 1 };
      }
      return { ...el };
    });
    setItems(newItems);
  };

  const handleReset = () => {
    setItems(initialItems);
    setAlert(
      `Reset succeed, you have ${insertedSum.toFixed(2)} coins returned`
    );
    setInsertedSum(0);
    setPrice(0);
  };

  const handleBuy = () => {
    setAlert(
      `You successfully bought, ${(insertedSum - price).toFixed(
        2
      )} coins returned`
    );
    setInsertedSum(0);
    setPrice(0);
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  return (
    <Wrapper>
      <Typography variant="h2" component="h2" textAlign="center">
        Vending Machine
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap="2px">
        {items.map((item) => {
          return (
            <VendingButton
              disabled={item.quantity === 0}
              key={item.id}
              action={() => {
                handleAddItemToBuy(item);
              }}
              item={item.name}
            />
          );
        })}
      </Stack>
      <Stack direction="row" gap="5px" justifyContent="center">
        <TextField
          disabled
          label="Sum to pay"
          value={price.toFixed(2)}
          size="small"
        />
        <TextField
          disabled
          label="Inserted sum"
          value={insertedSum.toFixed(2)}
          size="small"
        />
      </Stack>
      <Form onSubmit={handleSubmit}>
        <TextField
          size="medium"
          select
          label="coins"
          defaultValue={1}
          SelectProps={{
            native: true,
          }}
          variant="standard"
          onChange={(e) => setSelectedCoin(parseFloat(e.target.value))}
        >
          {COINS_MAP.map((option) => (
            <option key={`id_currency_${option}`} value={option}>
              {option}
            </option>
          ))}
        </TextField>
        <TextField
          size="medium"
          select
          label="currency"
          defaultValue={selectedCurrency}
          SelectProps={{
            native: true,
          }}
          variant="standard"
          onChange={(e) => setSelectedCurrency(e.target.value)}
          helperText="Please select your currency"
        >
          {CURRENCIES_MAP.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          Insert Coins
        </Button>
      </Form>
      <Stack flexDirection="row" gap="5px">
        <VendingButton item="Reset" action={handleReset} />
        <VendingButton
          item="Buy"
          disabled={price === 0 || insertedSum < price}
          action={handleBuy}
        />
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
        message={alert}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseAlert}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </Wrapper>
  );
};

export default VendingMachine;
