package com.shou.polar.props;

public enum ResNameSpace {
    PRESS("press");
    private final String name;
    ResNameSpace(final String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static String[] getNames() {
        ResNameSpace[] space = ResNameSpace.values();
        String[] names = new String[space.length];
        for (int i=0; i < space.length; ++i) {
            names[i] = space[i].getName();
        }
        return names;
    }
}
