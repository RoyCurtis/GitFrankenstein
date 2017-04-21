package roycurtis.signshopexport.json;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import org.bukkit.DyeColor;
import org.bukkit.block.banner.Pattern;
import org.bukkit.enchantments.Enchantment;
import org.bukkit.inventory.meta.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Type adapter to convert ItemMeta subtypes to JSON. This is a TypeAdapter instead of a
 * {@link com.google.gson.JsonSerializer}, because this allows us to write JSON using a Writer; a
 * faster and more memory efficient (i.e. less garbage) but less flexible method.
 */
class JsonItemMeta<T> extends TypeAdapter<T>
{
    @Override
    public void write(JsonWriter out, T value) throws IOException
    {
        // We should only reach here if T is indeed an ItemMeta
        ItemMeta meta = (ItemMeta) value;

        // This optimizes away "'meta': {}" from a lot of items. Violates DRY but we can't simply
        // begin a JSON object and then cancel it mid-checks.
        if ( isEmpty(meta) )
        {
            out.nullValue();
            return;
        }

        out.beginObject();

        handleGeneral(out, meta);
        handleEnchants(out, meta);

        if      (value instanceof BannerMeta)
            handleBanner(out, (BannerMeta) value);
        else if (value instanceof FireworkMeta)
            handleFirework(out, (FireworkMeta) value);
        else if (value instanceof FireworkEffectMeta)
            handleFireworkEffect(out, (FireworkEffectMeta) value);
        else if (value instanceof LeatherArmorMeta)
            handleLeatherArmor(out, (LeatherArmorMeta) value);
        else if (value instanceof MapMeta)
            handleMaps(out, (MapMeta) value);
        else if (value instanceof PotionMeta)
            handlePotions(out, (PotionMeta) value);
        else if (value instanceof SkullMeta)
            handleSkull(out, (SkullMeta) value);
        else if (value instanceof SpawnEggMeta)
            handleSpawnEgg(out, (SpawnEggMeta) value);

        out.endObject();
    }

    /** Checks if meta is effectively empty (e.g. not an item that typically holds data) */
    private boolean isEmpty(ItemMeta meta)
    {
        return !meta.hasDisplayName()
            && !meta.hasLore()
            && !meta.hasEnchants()
            && !(meta instanceof BannerMeta)
            && !(meta instanceof EnchantmentStorageMeta)
            && !(meta instanceof FireworkMeta)
            && !(meta instanceof FireworkEffectMeta)
            && !(meta instanceof LeatherArmorMeta)
            && !(meta instanceof MapMeta)
            && !(meta instanceof PotionMeta)
            && !(meta instanceof SkullMeta)
            && !(meta instanceof SpawnEggMeta);
    }

    /** Handles generic metadata (e.g. custom names, lore) */
    private void handleGeneral(JsonWriter out, ItemMeta meta) throws IOException
    {
        if ( meta.hasDisplayName() )
            out.name("displayName").value( meta.getDisplayName() );

        if ( meta.hasLore() )
            out.name("lore").beginArray()
                .value( meta.getLore().get(0) )
                .value( meta.getLore().get(1) )
                .value( meta.getLore().get(2) )
                .value( meta.getLore().get(3) )
                .endArray();

        // Only add "unbreakable" tag if true, since it's non-survival
        if ( meta.isUnbreakable() )
            out.name("unbreakable").value(true);
    }

    /**
     * Handles enchanted items. Enchants are stored in one of two separate locations:
     *
     * * ItemMeta.getEnchants() - If it's an enchanted item (e.g. sword)
     * * EnchantmentStorageMeta.getStoredEnchants() - If it's an enchanted book
     *
     * For cleaner data output, both are output to the same "enchantments" JSON object
     */
    private void handleEnchants(JsonWriter out, ItemMeta meta) throws IOException
    {
        Map<Enchantment, Integer> enchants = null;

        if ( meta.hasEnchants() )
            enchants = meta.getEnchants();
        else if (meta instanceof EnchantmentStorageMeta)
        {
            EnchantmentStorageMeta enchantMeta = (EnchantmentStorageMeta) meta;

            if ( enchantMeta.hasStoredEnchants() )
                enchants = enchantMeta.getStoredEnchants();
        }

        if (enchants == null)
            return;

        out.name("enchantments").beginObject();

        enchants.forEach( (e, i) -> {
            try
            {
                if (e == null || i == null) return;
                out.name( e.getName() ).value(i);
            }
            catch (IOException ignored) { }
        } );

        out.endObject();
    }

    /** Handles banners; only base color (as patterns would be too much data) */
    private void handleBanner(JsonWriter out, BannerMeta meta) throws IOException
    {
        DyeColor baseColor = meta.getBaseColor();

        // Due to SPIGOT-746, we sometimes have to get the base color from pattern 0...
        if (baseColor == null)
        {
            List<Pattern> patterns = meta.getPatterns();

            if (patterns.size() <= 0)
                return;
            else
                baseColor = patterns.get(0).getColor();
        }

        if (baseColor != null)
            out.name("baseColor").value( baseColor.toString() );
    }

    private void handleFirework(JsonWriter out, FireworkMeta meta) throws IOException
    {

    }

    private void handleFireworkEffect(JsonWriter out, FireworkEffectMeta meta) throws IOException
    {

    }

    private void handleLeatherArmor(JsonWriter out, LeatherArmorMeta meta) throws IOException
    {

    }

    private void handleMaps(JsonWriter out, MapMeta meta) throws IOException
    {
        if ( meta.hasLocationName() )
            out.name("location").value( meta.getLocationName() );

        if ( meta.hasColor() )
            out.name("color").value( meta.getColor().toString() );
    }

    private void handlePotions(JsonWriter out, PotionMeta meta) throws IOException
    {

    }

    private void handleSkull(JsonWriter out, SkullMeta meta) throws IOException
    {

    }

    private void handleSpawnEgg(JsonWriter out, SpawnEggMeta meta) throws IOException
    {

    }

    /** Not necessary; we're never going to read these */
    @Override
    public T read(JsonReader in) throws IOException
    {
        return null;
    }
}