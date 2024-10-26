import { cn } from "@/lib/utils";
import { priceIcon } from "@/utils/constants";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import useStore from "@/hooks/use-store";

export default function StoreProductDetails({ item, setDisplayProductDetails }) {
    const [displayImage, setDisplayImage] = useState(null);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const { handleSetCartItem } = useStore();

    useEffect(() => {
        if (item) {
            setDisplayImage(item?.images?.[0]?.url);
            setSelectedVariantIndex(0);
        }
        return () => {
            setDisplayImage(null);
            setSelectedVariantIndex(0);
        };
    }, [item]);

    if (!item) return null;


    const selectedVariant = item.variants[selectedVariantIndex];

    return (
        <Dialog open={!!item} onOpenChange={() => setDisplayProductDetails(null)}>
            <DialogContent className="max-w-[700px] p-6 rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{item.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-[300px_1fr]">
                    <div>
                        <div className="h-64 w-full rounded-lg border overflow-hidden">
                            {displayImage && (
                                <img
                                    alt={item.title}
                                    src={displayImage}
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            {item?.images.map((img) => (
                                <div
                                    key={img.img_id}
                                    className={cn(
                                        'h-20 cursor-pointer rounded-lg border transition duration-200 ease-in-out',
                                        displayImage === img.url ? 'border-primary transform scale-105' : ''
                                    )}
                                    onClick={() => setDisplayImage(img.url)}
                                >
                                    <img
                                        alt={item.title}
                                        src={img.url}
                                        className="h-full w-full object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <span className="rounded-sm bg-accent px-2 py-1 text-xs">{item.ctg_name}</span>
                        </div>
                        <p className="text-2xl font-bold">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>

                        <div>
                            <p className="mb-2 font-semibold">Select Variant:</p>
                            <Select
                                value={selectedVariantIndex.toString()}
                                onValueChange={(value) => setSelectedVariantIndex(parseInt(value, 10))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a variant" />
                                </SelectTrigger>
                                <SelectContent>
                                    {item.variants.map((variant, index) => (
                                        <SelectItem key={variant.variant_id} value={index.toString()}>
                                            {variant.variant_title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="mt-4">
                                <p className="font-semibold">Selected Variant: <span className="font-bold">{selectedVariant?.variant_title}</span></p>
                                <p className="mt-2 text-lg font-bold">{priceIcon}{selectedVariant?.price}</p>
                                <p className="mt-1">
                                    {selectedVariant?.stock <= 20 && selectedVariant?.stock > 0 &&
                                        <span className='text-red-500'>
                                            Only {selectedVariant?.stock} Left
                                        </span>
                                    }
                                    {selectedVariant?.stock === 0 &&
                                        <span className='text-red-500'>
                                            out of stock
                                        </span>
                                    }
                                </p>
                                <Button
                                    size="sm"
                                    className="mt-2"
                                    disabled={selectedVariant?.stock === 0}
                                    onClick={() => handleSetCartItem({
                                        product_id: item.product_id,
                                        variant_id: item.variants?.[selectedVariantIndex]?.variant_id,
                                        acc_id: item?.acc_id
                                    })}
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}