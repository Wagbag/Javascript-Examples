//Fractal Generator
//Jacob Wagner

//******************************************************************************************
//******************************************************************************************

function MyCanvas(width, height) {
    
    if (width == undefined || width < 0) {
        width = 300;
    }
    
    if (height == undefined || height < 0) {
        height = 300;
    }
    
    // create the canvas
    var canvas = document.createElement('canvas')
    canvas.height = height;
    canvas.width = width;
    
    
    this.lightChange = 2;
    
    // add it to the document 
    document.body.appendChild(canvas);
    
    this.width=width;
    this.height=height;
    this.clearColor = "#000000";
    this.points=0;
    this.pointColor="black";
    this.maxPoints=0;
    this.ctx= canvas.getContext("2d");
    
    
    //building and filling the sweet array
    this.data = new Array(this.width);
    
    for(var x=0; x< this.width; x++){
        this.data[x] = new Array(this.height);
        
        for(y=0; y < this.height;y++){
            this.data[x][y] = {'lit':0}
        }
    }
    
    return this;
    
}

//******************************************************************************************

MyCanvas.prototype={
    
    Clear: function() {
        //Clears the screen. sets it to either white or blackn't equal
        
        this.ctx.fillStyle=this.clearColor;
        this.ctx.fillRect(0,0,this.width,this.height);
        
        return;
    },
    
    SetClearColor: function(color) {
        //background color. White or Black only
        
        this.clearColor = color;
        
        if (color == "white") {
            this.lightChange = 1;
        } else {
            this.lightChange = -1;
        }
        
        return;
    },
    
    Redisplay: function(pos) {
       //Redisplays the screen. Used to show the fractal image
        
        var color, x,y;
        this.Clear();
        
        for(x =0; x < this.width; x++) {
            for(y=0; y < this.height;y++) {
                
                // only draw cells if lit is 1 
                if (this.data[x][y].lit == 1) {
                    
                    this.ctx.fillStyle = this.pointColor;
                    this.ctx.fillRect(x,y,1,1);
                    
                }
            }
        }
        return;
    },
    
    SetMaxPoints: function(pointID){
        //Sets max point based on interface input
        
        var pointNode  = document.getElementById(pointID);
        var point = parseInt(pointNode.value);
        
        if(point>0){
            this.maxPoints=point;}
            
            else
                this.maxPoints=1000;
    },
    
    SetPointColor: function(color){
        //Sets the dot color based on interface selection input
        
        this.pointColor=color;
    },
    
    ClearArray: function(){
        //Clears the array and sets all lit values to 0
        //Use: Called in the Compute function. 
        
        for(var x=0; x< this.width; x++){
            for(y=0; y < this.height;y++){
                this.data[x][y] = {'lit':0}
            }
        }
    },
    
    Compute: function (walk,pos){
        //Restarts the fractal and does it again. 
        
        this.ClearArray();
        this.points=0;
        walk.StartPoint(this,pos);
        walk.Walker(this,pos);
        
    }
    
};

//******************************************************************************************
//******************************************************************************************

function WalkObj(ctx){
    
    this.color;
    this.x;
    this.y;
    this.maxSteps=0;
    return this;
}

//******************************************************************************************
// Below are the associated functions to the WalkObj
WalkObj.prototype={
    
    StartPoint:	function(canvasRef,pos){
        //Places the first point on the screen. Places at center. 
        
        pos.SetCenterCoord(canvasRef);
        canvasRef.data[pos.xCen][pos.yCen].lit=1;
        
        canvasRef.Redisplay(pos);
        
        pos.NewTheta();     //initial theta
        pos.ComputeXY();    //initial x and y along radius of circle
        
        
    },	//close of StartPoint function
    
    Walker: function(canvasRef,pos){
        // Main function that does all the walking, calculates if blocks are adjacent, places blocks, ect. THE BRAINS!!!     
        
        var moveDis;    //will be between 1 and 4. 1 being up. 2 being right. 3 being down, 4 being left//
        // 5 is up right, 6 is down right, 7 is down left, 8 is up left
        
        var adjBlock=0; //true false value for adjacent blocks
        
        var step=0; //counter for maxSteps
        
        while(canvasRef.points < canvasRef.maxPoints){ //While current points is less to max points
            
            while( step!=this.maxSteps && canvasRef.points < canvasRef.maxPoints){ //while steps is not max steps and points less 
                // than max points
                
                moveDis=Math.floor((Math.random() * 8) + 1);	//random #s from 1-8
                
                switch(moveDis){
                    case 1: pos.newY=pos.newY+1;
                    break;
                    case 2:	pos.newX=pos.newX+1;
                    break;
                    case 3:	pos.newY=pos.newY-1;
                    break;
                    case 4:	pos.newX=pos.newX-1;
                    break;
                    case 5: pos.newY=pos.newY+1;pos.newX=pos.newX+1;
                    break;
                    case 6:	pos.newY=pos.newY-1;pos.newX=pos.newX+1;
                    break;
                    case 7:	pos.newY=pos.newY-1;pos.newX=pos.newX-1;
                    break;
                    case 8:	pos.newY=pos.newY+1;pos.newX=pos.newX-1;
                    break;
                }
                
                
                
                if(pos.newX > 0 && pos.newY > 0 && pos.newX < canvasRef.data.length-1 && pos.newY < canvasRef.data.length-1){
                    //Checks to make sure newX and newY are in bounds.
                    
                    
                    //checking the surrounding blocks
                    if(canvasRef.data[pos.newX][pos.newY+1].lit == 1){
                        
                        this.AddPoint(canvasRef, pos);
                        adjBlock=1;
                    }
                    else if(canvasRef.data[pos.newX][pos.newY-1].lit == 1){
                        
                        this.AddPoint(canvasRef, pos);
                        adjBlock=1;
                    }
                    else if(canvasRef.data[pos.newX+1][pos.newY].lit == 1){
                        
                        this.AddPoint(canvasRef, pos);
                        adjBlock=1;
                    }
                    else if(canvasRef.data[pos.newX-1][pos.newY].lit == 1){
                        
                        this.AddPoint(canvasRef, pos);
                        adjBlock=1;
                    }
                    
                    else if(canvasRef.data[pos.newX+1][pos.newY+1].lit == 1){
                        
                        this.AddPoint(canvasRef, pos);
                        adjBlock=1;
                    }
                    else if(canvasRef.data[pos.newX+1][pos.newY-1].lit == 1){
                        
                        this.AddPoint(canvasRef, pos);
                        adjBlock=1;
                    }
                    else if(canvasRef.data[pos.newX-1][pos.newY+1].lit == 1){
                        
                        this.AddPoint(canvasRef, pos);
                        adjBlock=1;
                    }
                    else if(canvasRef.data[pos.newX-1][pos.newY-1].lit == 1){
                        
                        this.AddPoint(canvasRef, pos);
                        adjBlock=1;
                    }
                    
                }
                step++;   
                
                
                if(adjBlock==1){ //If adjacent block was found. Will place new point to walk from
                    
                    pos.ComputeDistance();
                    pos.UpdateRadius();
                    
                    pos.NewTheta();     
                    pos.ComputeXY(); 
                    
                    adjBlock=0;
                }
                
                if(pos.newX <= 0 || pos.newY <= 0 || pos.newX >= canvasRef.data.length-1 
                    || pos.newY >= canvasRef.data.length-1){ //Checks to see if newX and newY are out of bounds.
                        
                        pos.NewTheta();     
                        pos.ComputeXY();     
                    }
                    
                    if(step==this.maxSteps){ //If walk takes max steps
                        
                        pos.NewTheta();
                        pos.ComputeXY(); 
                        
                    }
                    
            } //end of inner while loop steps
            
            step=0; //Resets counter so walker can continue to walk around!
            
        } //end of outter while loop points
        
        canvasRef.Redisplay(pos);   //PRINTS THE FRACTAL IMAGE WHEN THE WALK FUNCTION FINISHES. 

    },// close of walk function
    
    AddPoint: function( canvasRef, pos){
        //This function adds a point to the array to be colored by redisplay. 
        //Called when walker finds a lit adjacent block
        
        canvasRef.data[pos.newX][pos.newY].lit=1;
        canvasRef.points++;
    },
    
    SetMaxSteps: function(stepID){
        //Sets the max steps. Based on text input from user at interface
        //Pre: NEED stepID from input
        
        var stepNode  = document.getElementById(stepID);
        var step = parseInt(stepNode.value);
        
        if(step>0){
            this.maxSteps=step;}
            
            else
                this.maxSteps=10000;
    }
    
    
}; //close of prototype function

//******************************************************************************************
//******************************************************************************************

function Position(){
    
    this.theta;
    this.newX=0;
    this.newY=0;
    
    this.xCen=0;  //x center
    this.yCen=0;  //y center
    
    this.dist=0;
    this.radius=2;
    
    
}

//******************************************************************************************

Position.prototype={
    
    NewTheta: function(){
        //Generates a theta for a circle
        
        var temp=Math.random()*360 ;  
        this.theta= temp;
        
        //this.theta= Math.floor((Math.PI * temp)/180); //THIS CODE MAKES THE PROGRAM SCREW UP HARD 
        
        //I have no clue why that conversion would do that.
        //Replace theta= temp with the commented out code. ^^^^^
    },
    
    SetCenterCoord: function(ctx){
        //Sets the center coordinates for program start
        
        this.xCen=Math.floor(ctx.width / 2);
        this.yCen=Math.floor(ctx.height / 2);
        
    },
    
    ComputeXY: function(){
        //Computes X and Y along a radius around the center
        //Pre: Need theta to be initialized. 
        
        this.newX=Math.floor(this.xCen + (this.radius * Math.cos(this.theta)));
        this.newY=Math.floor(this.yCen + (this.radius * Math.sin(this.theta)));
        
        
    },
    
    ComputeDistance: function(){    //used when a point connects to another
        //Computes distance from newly placed point to the center
        
        this.dist=Math.floor((Math.sqrt( Math.pow(this.newX - this.xCen, 2) + Math.pow(this.newY - this.yCen, 2)))); 
    },
    
    UpdateRadius: function (){
        //Updates the radius to be the calculated distance if bigger than current radius
        //Pre: Distance must be initialized
        
        this.radius= Math.floor((Math.max(this.dist,this.radius)));
        
    }
    
};
