def analizar_dimensiones(largo, ancho):
    area = largo * ancho
    perimetro = 2 * (largo + ancho)
    return area, perimetro #python  crea una tupla. area perimetro
#desempaquetar la tupla
area_rec,  perimetro_rec = analizar_dimensiones(5,3)
print(f"Area: {area_rec}, Perimetro: {perimetro_rec}")