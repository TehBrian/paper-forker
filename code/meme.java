public abstract class MinecraftApi {
    
    public abstract void onMinecraftUpdate();

}

public class Spigot extends MinecraftApi {
    
    @Override
    public void onMinecraftUpdate() {
        // do nothing
    }

}

public class Paper extends MinecraftApi {
    
    @Override
    public void onMinecraftUpdate() {
        for (Change change : Minecraft.changes()) {
            optimize();
        }

        updatePatches();

        for (Patch patch : newPatches) {
            testThoroughly();
        }

        this.version++;
    }

}

public class Yatopia extends MinecraftApi {
    
    @Override
    public void onMinecraftUpdate() {
        wreakHavoc()
    }

}
