import Input from '../../ui/Input'
import Form from '../../ui/Form'
import Button from '../../ui/Button'
import FileInput from '../../ui/FileInput'
import Textarea from '../../ui/Textarea'
import FormRow from '../../ui/FormRow'
import { useForm } from 'react-hook-form'
import { useCreateCabin } from './useCreateCabin'
import { useEditCabin } from './useEditCabin'

function CreateCabinForm({ cabinToEdit = [], onCloseModal, onCloseForm }) {
  const { id: editId, ...editValue } = cabinToEdit
  const isEditSession = Boolean(editId)
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValue : {},
  })
  const { errors } = formState
  //create
  const { isCreating, createCabin } = useCreateCabin()
  //edit
  const { isEditing, editCabin } = useEditCabin()

  const isWorking = isCreating || isEditing

  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0]
    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: (data) => {
            reset()
            onCloseForm?.()
          },
        },
      )
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset()
            onCloseModal?.()
          },
        },
      )
  }
  function onError(errors) {
    // console.log(errors)
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow error={errors?.name?.message} label={'Cabin name'}>
        <Input
          type="text"
          id="name"
          disabled={isCreating}
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow error={errors?.maxCapacity?.message} label={'Maximum capacity'}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'The capacity has to be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow error={errors?.regularPrice?.message} label={'Regular price'}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'The price has to be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow error={errors?.discount?.message} label={'discount'}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              +value <= +getValues().regularPrice ||
              'Discount shold be less than the regular price',
          })}
        />
      </FormRow>

      <FormRow error={errors?.description?.message} label={'description'}>
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label={'Cabin photo'}>
        <FileInput
          id="image"
          accept="image/*"
          {...register('image', {
            required: isEditSession ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.() || onCloseForm?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? 'Edit the cabin' : 'Create a new cabin'}
        </Button>
      </FormRow>
    </Form>
  )
}

export default CreateCabinForm
