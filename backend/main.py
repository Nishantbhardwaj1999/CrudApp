import logging  # Import the logging module

from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId  # Import ObjectId from pymongo

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)  # Set logging level to INFO

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your frontend application
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://localhost:27017/")
db = client["crud_app"]
collection = db["items"]  # Assuming "items" is your collection name

class Item(BaseModel):
    name: str
    description: str

@app.post("/items/")
async def create_item(item: Item):
    try:
        inserted_item = collection.insert_one(item.dict())
        logging.info("Item created: %s", item)
        return {"id": str(inserted_item.inserted_id), "name": item.name, "description": item.description}
    except Exception as e:
        logging.error("Error creating item: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/items/{item_id}")
async def read_item(item_id: str):
    try:
        item = collection.find_one({"_id": ObjectId(item_id)})
        if item:
            logging.info("Item read: %s", item)
            return {"id": str(item["_id"]), "name": item["name"], "description": item["description"]}
        else:
            logging.warning("Item not found with ID: %s", item_id)
            raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
        logging.error("Error reading item: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.put("/items/{item_id}")
async def update_item(item_id: str, item: Item):
    try:
        existing_item = collection.find_one({"_id": ObjectId(item_id)})
        if existing_item:
            # Convert the existing item to an Item object
            existing_item = Item(**existing_item)
            # Check if the new data is different from the existing data
            if existing_item.dict() != item.dict():
                result = collection.update_one({"_id": ObjectId(item_id)}, {"$set": item.dict()})
                if result.modified_count == 1:
                    updated_item = collection.find_one({"_id": ObjectId(item_id)})
                    logging.info("Item updated: %s", updated_item)
                    return {"message": "Item updated successfully", "item": updated_item}
                else:
                    logging.error("Failed to update item: %s", item_id)
                    raise HTTPException(status_code=500, detail="Failed to update item")
            else:
                logging.warning("No changes detected for item with ID: %s", item_id)
                return {"message": "No changes detected for item"}
        else:
            logging.warning("Item not found with ID: %s", item_id)
            raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
        logging.error("Error updating item: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.delete("/items/{item_id}")
async def delete_item(item_id: str):
    try:
        result = collection.delete_one({"_id": ObjectId(item_id)})
        if result.deleted_count == 1:
            logging.info("Item deleted with ID: %s", item_id)
            return {"message": "Item deleted successfully"}
        else:
            logging.warning("Item not found with ID: %s", item_id)
            raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
        logging.error("Error deleting item: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")
