package roycurtis.signshopexport;

import org.bukkit.Location;
import org.bukkit.block.Sign;
import org.bukkit.inventory.ItemStack;
import org.wargamer2010.signshop.Seller;
import org.wargamer2010.signshop.util.economyUtil;
import org.wargamer2010.signshop.util.itemUtil;

public class Record
{
    // Location
    public String locWorld;
    public int    locX;
    public int    locY;
    public int    locZ;

    // Owner
    public String ownerName;

    // Sign data
    public String signType;
    public double signPrice;

    // Inventory data
    public ItemStack[] invItems;
    public boolean     invInStock;

    static Record fromSeller(Seller sign)
    {
        Record   rec = new Record();
        Location loc = sign.getSignLocation();

        rec.locWorld = loc.getWorld().getName();
        rec.locX     = loc.getBlockX();
        rec.locY     = loc.getBlockY();
        rec.locZ     = loc.getBlockZ();

        rec.ownerName = sign.getOwner().getName();

        rec.signType  = sign.getOperation();
        rec.signPrice = economyUtil.parsePrice(((Sign) sign.getSign().getState()).getLine(3));

        rec.invItems = sign.getItems();

        switch(rec.signType)
        {
            case "buy":
            case "ibuy":
                rec.invInStock = itemUtil.stockOKForContainables(sign.getContainables(), sign.getItems(), true);
                break;
            case "sell":
            case "isell":
                rec.invInStock = itemUtil.stockOKForContainables(sign.getContainables(), sign.getItems(), false);
                break;
            default:
                rec.invInStock = true;
                break;
        }

        return rec;
    }
}