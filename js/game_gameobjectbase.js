function NewMesh(setimgsrc = "img/Blank1.png", setPosition = [0, 0], setRotation = 0, setScale = [1, 1]){
    let img = new Image(); 
    img.src = setimgsrc;
    
    let newMesh = {};
    newMesh.Type = "Mesh";
    newMesh.Img = img; 
    newMesh.Position = setPosition;
    newMesh.Rotation = setRotation;
    newMesh.Scale = setScale;
    
    newMesh.Size = function() {
        if (this.Img.width != 0 && this.Img.height != 0){
            return [this.Scale[0] * this.Img.width, this.Scale[1] * this.Img.height];
        } else {
            return [this.Scale[0] * 16, this.Scale[1] * 16];
        }
    };

    newMesh.Collision = function(other){
        /*
        if (other.Position[0] + other.Img.width * other.Scale[0] > this.Position[0] && 
            other.Position[0] < this.Position[0] + this.Img.width * this.Scale[0] &&
            other.Position[1] + other.Img.height * other.Scale[1] > this.Position[1] && 
            other.Position[1] < this.Position[1] + this.Img.height * this.Scale[1]){
                this.CollisionEXE(other);
                return true;
            }
        */

        if(
            Math.pow(this.Position[0] - other.Position[0], 2) + 
            Math.pow(this.Position[1] - other.Position[1], 2) < 
            (Math.max(this.Img.width * this.Scale[0], this.Img.height * this.Scale[1]) + 
            Math.max(other.Img.width * other.Scale[0], other.Img.height * other.Scale[1])) * 16
            ){
            this.CollisionEXE(other);
            return true;
        }

        return false;
    };

    newMesh.Forward = function(){
        return [Math.sin(-this.Rotation * Math.PI/180), Math.cos(-this.Rotation * Math.PI/180)];
    }

    newMesh.CollisionEXE = function(other){};

    newMesh.Update = function(){};

    newMesh.Draw = function(){
        CM.Pen.translate(this.Position[0] - (Player.Position[0] - CM.Size()[0]/2), this.Position[1] - (Player.Position[1] - CM.Size()[1]/2));
        CM.Pen.rotate(Math.PI/180 * this.Rotation);
        CM.Pen.scale(this.Scale[0], this.Scale[1]);
        CM.Pen.drawImage(this.Img, - this.Img.width/2, - this.Img.height/2);
        CM.Pen.resetTransform();
    };

    newMesh.Q = function(){};
    
    return newMesh;
}

function NewProp(setimgsrc = "img/Blank1.png", setPosition = [0, 0], setRotation = 0, setScale = [1, 1], setForceP = [0, 0], setForceR = 0){
    let newProp = NewMesh(setimgsrc, setPosition, setRotation, setScale);
    newProp.Type = "Prop";
    newProp.ForceP = setForceP;
    newProp.ForceR = setForceR;
    newProp.FrictionP = 0.97;
    newProp.FrictionR = 0.90;
    newProp.Update = function(){
        
        this.Rotation = this.Rotation + this.ForceR;
        this.Position = [this.Position[0] + this.ForceP[0], this.Position[1] + this.ForceP[1]];

        this.ForceP = [this.ForceP[0] * this.FrictionP, this.ForceP[1] * this.FrictionP];
        this.ForceR = this.ForceR * this.FrictionR;
    };

    return newProp;
}

function NewActor(setimgsrc = "img/Blank1.png", setPosition = [0, 0], setRotation = 0, setScale = [1, 1], setForceP = [0, 0], setForceR = 0, setHealth = 100, setInventory = []){
    let newActor = NewProp(setimgsrc, setPosition, setRotation, setScale, setForceP, setForceR);
    newActor.Type = "Actor";
    newActor.Health = setHealth;
    newActor.Inventory = setInventory;
    
    newActor.InventoryAdd = function(itemID){
        for (let i = 0; i < this.Inventory.length; i++){
            if (this.Inventory[i][0] == itemID){
                this.Inventory[i][1]++;
                return this.Inventory[i][1];
            }
        }

        this.Inventory.push(Array(itemID, 1));
        return 1;
    };
    
    newActor.InventoryRemove = function(itemID){
        for (let i = 0; i < this.Inventory.length; i++){
            if (this.Inventory[i][0] == itemID){
                if (this.Inventory[i][1] > 0){
                    this.Inventory[i][1]--;
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        return 0;
    };
    return newActor;
}

function NewItem(setPosition, setItemID){
    let newItem = NewProp("img/PlanetShade0.png", setPosition, 0, [2, 2], [0, 0], [0, 0]);
    newItem.Type = "Item";
    newItem.ItemID = setItemID;

    newItem.CollisionEXE = function(other){
        switch (other.Type){
            default:
                return 0;
                break;

            case "Player":
                //other.InventoryAdd(this.ItemID);
                //GOM.GameObjetsRemove(this);
                break;
        }
    };

    return newItem;
}