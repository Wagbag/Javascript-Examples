function Canvas(width, height, locID) {
    
    if (width == undefined || width < 0) {
        width = 300;
    }
    
    if (height == undefined || height < 0) {
        height = 300;
    }
    
    var canvas = document.createElement('canvas')
    canvas.height = height;
    canvas.width = width;
    
    if(locID == undefined) {
        document.body.appendChild(canvas);
    } else {
        div = document.getElementById(locID);
        if (null == div) {
            document.body.appendChild(canvas);
        } else {
            div.appendChild(canvas);
        }
    }
    
    document.body.appendChild(canvas);
    
    this.width = width;
    this.height = height;
    this.clearColor = {"R":255, "G": 255, "B": 255}
    this.ctx =  canvas.getContext("2d");
    
    this.frameBuffer = new Array(this.width);
    for(var x = 0; x < this.width; x++) {
        this.frameBuffer[x] = new Array(this.height);
        for(var y=0; y < this.height; y++) {
            this.frameBuffer[x][y] = {"R": this.clearColor.R,
                "G": this.clearColor.G, "B": this.clearColor.B};
        }
    }
    
    return this;
}

Canvas.prototype = {
    
    SetClearColor: function(r,g,b) {
        this.clearColor.R = r; 
        this.clearColor.G = G; 
        this.clearColor.B = B; 
        return;
    },
    
    Width: function() {
        return this.width;
    },
    
    Height: function() {
        return this.height;
    },
    
    Clear: function() {
        for(var x = 0; x < this.width; x++) {
            for(var y=0; y < this.height; y++) {
                this.frameBuffer[x][y].R = this.clearColor.R;
                this.frameBuffer[x][y].G = this.clearColor.G;
                this.frameBuffer[x][y].B = this.clearColor.B;
            }
        }
        return;
    },
    
    Redisplay: function() {
        for(var x = 0; x < this.width; x++) {
            for(var y=0; y < this.height; y++) {
                color = "rgb(" + this.frameBuffer[x][y].R
                + ", " + this.frameBuffer[x][y].G
                + ", " + this.frameBuffer[x][y].B +")";
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x,y,1,1);
            }
        }	
        return;
    },
    
    SetPoint: function(x,y,r,g,b) {
        if (x >= 0 && x < this.width && y > 0 && y <= this.height) {
            y = this.height-y;
            this.frameBuffer[x][y].R = Clamp(0,255,r);
            this.frameBuffer[x][y].G = Clamp(0,255,g);
            this.frameBuffer[x][y].B = Clamp(0,255,b);
        } else {
            console.log("Set Point Error, ", x, y, r, g, b);
        }
        return;
    },
    
    Point: function(x,y, r,g,b) {
        this.SetPoint(x,y,r,g,b);
    },
    
	ColorCall: function(c0,c1,t)
	{
		var B;
		
		B=((1-t)*c0 + t*c1);
		
		return B;
	},
    
   
    JackBresenham: function(x1, y1, r1, g1, b1, x2, y2, r2, g2, b2) {

		var dx, dy, d;
        var x,y;
        var m;	//slope
        
		
		var temp = 0;			//Collaborated with Zach with the beard. Used for other half of the circle
		if(x2 < x1 && y2 < y1)
		{
			temp=x1;
			x1=x2;
			x2=temp;
			
			temp = y1;
			y1 = y2;
			y2= temp;
			
			temp=r1;
			r1=r2;
			r2=temp;
			
			temp = g1;
			g1 = g2;
			g2= temp;
			
			temp = b1;
			b1 = b2;
			b2= temp;
		}
		else if(x2 < x1 && y2 > y1)
		{
			temp=x1;
			x1=x2;
			x2=temp;
			
			temp = y1;
			y1 = y2;
			y2= temp;
			
			temp=r1;
			r1=r2;
			r2=temp;
			
			temp = g1;
			g1 = g2;
			g2= temp;
			
			temp = b1;
			b1 = b2;
			b2= temp;
		}
		
		

		dy = y2-y1;
        dx = x2-x1;
        
		
		m=(dy/dx);				//Collaborated with Anthony with the slope. He helped me understand how to identify the octal I was in.
		
        //BORDERS *******************************************   
	   
	if (dx == 0 && dy == 0)  {
	    // attempt to draw a degenerate line (a point)
	    this.SetPoint(x1, y1, r1, g1,b1)
	} else if (dx == 0) {
	    // no change in x, so it is a vertical line
	    
		
		var sy = Math.min(y1,y2);
	    var ey = Math.max(y1, y2);
	    for(y=sy; y <= ey; y++) {
					
			var temp= ((y-y1)/(dy));
			r= Math.round(this.ColorCall(r1,r2,temp));
			g= Math.round(this.ColorCall(g1,g2,temp));
			b= Math.round(this.ColorCall(b1,b2,temp));
		   
		   this.SetPoint(x1,y,r,g,b);
	    }
	} else if (dy == 0) {
	    // no change in y so it is a horizontal line.
	    var sx = Math.min(x1,x2);
	    var ex = Math.max(x1, x2);
	    for(x=sx; x <= ex; x++) {
			
			var temp= ((x-x1)/(dx));
			r= Math.round(this.ColorCall(r1,r2,temp));
			g= Math.round(this.ColorCall(g1,g2,temp));
			b= Math.round(this.ColorCall(b1,b2,temp));
			
			this.SetPoint(x,y1,r,g,b);
	    }
	}
	
	//**************************************************************************
	
	else if(dy==dx){
		if(x1 < x2 && y1 < y2){	//diagonal up right
			
			y=y1;
			for(x=x1; x<=x2;x++){
								
				this.SetPoint(x,y,r1,g1,b1);
				y++;
			}
		}
	else if(x1 < x2 && y1 > y2){	//diagonal down right 
			
			y=y1;
			for(x=x1; x<=x2;x++){
				this.SetPoint(x,y,r1,g1,b1);
				y--;
			}
		}
	else if(x1 > x2 && y1 > y2){	//diagonal down left	
			
			y=y1;
			for(x=x1; x>=x2;x--){
				this.SetPoint(x,y,r1,g1,b1);
				y--;
			}
		}
	else if(x1 > x2 && y1 < y2){	//diagonal up left 		
			
			y=y1;
			for(x=x1; x>=x2;x--){
				this.SetPoint(x,y,r1,g1,b1);
				y++;
			}
		}
		
	}
		
	//**************************************************************************
	
	else if(m>0 && m<1)
	{
		
		if(x2 > x1)
		{
			d = 0;
			y = y1;
			A = -2 * dx;
			B = 2 * dy;
			var r,g,b;	//temp holders for colors
			
				for(x = x1; x <= x2; x++) {         //0
		
					var temp= ((x-x1)/(dx));
					r= Math.round(this.ColorCall(r1,r2,temp));
					g= Math.round(this.ColorCall(g1,g2,temp));
					b= Math.round(this.ColorCall(b1,b2,temp));
					
					this.SetPoint(x,y,r,g,b);

					if (d >= 0) {
						d += A;
						y++;
					}
					d += B;
            
				}
		}		
	}
	
	else if( m > 1)
	{
		if(x2>x1)
		{
			d = 0;
			x = x1;
			A = -2 * dy;    
			B = 2 * dx;
				
				for(y = y1; y <= y2; y++) 		//1
				{         
					var temp= ((y-y1)/(dy));
					r= Math.round(this.ColorCall(r1,r2,temp));
					g= Math.round(this.ColorCall(g1,g2,temp));
					b= Math.round(this.ColorCall(b1,b2,temp));
				
				
					this.SetPoint(x,y,r,g,b);
					
					if (d >= 0) 
					{
						d += A;
						x++;
					}
					
					d += B;
				}
		}		
	}
    
	
	else if(m < 0 && m >= -1)
	{
		
		if(y2 < y1)
		{
			d = 0;
			y = y1;
			A = -2 * dx;
			B = 2 * dy;

				for(x = x1; x <= x2; x++) {         //7
					
					var temp= ((x-x1)/(dx));
					r= Math.round(this.ColorCall(r1,r2,temp));
					g= Math.round(this.ColorCall(g1,g2,temp));
					b= Math.round(this.ColorCall(b1,b2,temp));
					
					
					this.SetPoint(x,y,r,g,b);

					if (d >= 0) {
						d += A;
						y--;
					}
					d -= B;
            
				}
		}	
	}
	
	else if( m <= -1)
	{

		if(y2 < y1)
		{
			d = 0;
			x = x1;
			A = -2 * dy;    
			B = 2 * dx;     
				for(y = y1; y >= y2; y--) 		//6
				{    

					var temp= ((y-y1)/(dy));
					r= Math.round(this.ColorCall(r1,r2,temp));
					g= Math.round(this.ColorCall(g1,g2,temp));
					b= Math.round(this.ColorCall(b1,b2,temp));

					this.SetPoint(x,y,r,g,b);
					
					if (d >= 0) 
					{
						d -= A;
						x++;
					}
					
					d += B;
				}
		}
		 
	}
	
	        
        return;
    }
};

function Clamp(min, max, v) {
    return Math.max(min, Math.min(v,max));
}

